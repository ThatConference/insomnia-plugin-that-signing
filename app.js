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
      // we don't need this good to fire if the template and key isn't set
      console.log('no signing key set, leaving plugin');
      return;
    }
    console.log("payload", payload);
    const allHeaders = context.request.getHeaders();
    const header = allHeaders.filter((h) => h.value === placeholderText);
    console.log("header", header);
    if (header?.length > 1)
      throw Error("multiple headers found with placement text");
    const headerName = header[0].name;
    const thatSigning = security.requestSigning;
    const requestSigning = thatSigning({ signingKey });
    const signature = requestSigning.signRequest(payload);
    console.log("signature", signature);
    if (signature?.isOk !== true || !signature?.thatSig) {
      throw new Error(`unable to sign request: ${signature?.message}`);
    }

    context.request.setHeader(headerName, signature.thatSig);
  },
];
