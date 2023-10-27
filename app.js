const { security } = require("@thatconference/api");

const thatSigHeader = "that-request-signature";
const placeholderText = "~headerdataplaceholder~";
let signingKey;

module.exports.templateTags = [
  {
    name: "thatrequestsigningplugin",
    displayName: "THAT Signature",
    description: "Generates a THAT Signature for request signing",
    args: [
      {
        displayName: "Signing Key",
        type: "string",
        placeholder: "THAT signing key",
        description: "Required value, secret signing key for signing request",
      },
    ],
    run(context, key = "") {
      if (!key)
        throw new Error("Signing Key is required to use THAT Signing plugin");
      signingKey = key;

      return placeholderText;
    },
  },
];

module.exports.requestHooks = [
  (context) => {
    let payload = context.request.getBody();
    if (signingKey) {
      if (payload?.text) {
        payload = JSON.parse(payload.text);
      } else {
        console.log('error: no request body to sign');
        throw new Error("There is no request body to sign");
      }
    } else {
      // we don't need this goo to fire if the template and key isn't set
      console.log('no signing key set, leaving plugin');
      return;
    }
    console.log("payload", payload);
    const allHeaders = context.request.getHeaders();
    const header = allHeaders.filter((h) => h.value === placeholderText);
    console.log("header", header);
    if (!header || header.length < 1){
      console.log(`header value not set, leaving plugin`);
      return;
    }
    if (header?.length > 1){
      const msg = "multiple headers found with placement text";
      console.log(msg);
      throw Error(msg);}
    const headerName = header[0].name;
    console.log(`using ${headerName} for singing signature`);
    const thatSigning = security.requestSigning;
    const requestSigning = thatSigning({ signingKey });
    const signature = requestSigning.signRequest(payload);
    console.log("signature", signature);
    if (signature?.isOk !== true || !signature?.thatSig) {
      const msg = `unable to sign request: ${signature?.message}`;
      console.log(msg);
      throw new Error(msg);
    }

    context.request.setHeader(headerName, signature.thatSig);
  },
];
