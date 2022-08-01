import dedent from "dedent";

export const config = {
  runtime: "experimental-edge",
};

/**
 * @param {string} string
 * @param {string} searchString
 * @returns {string}
 */
function sliceFrom(string, searchString) {
  return string.slice(string.indexOf(searchString) + searchString.length);
}

/**
 * @param {Request} request
 * @returns {Response}
 */
export default function autoconfig(request) {
  const query = new URLSearchParams(sliceFrom(request.url, "?"));

  const email = query.get("emailaddress");
  if (!email) return new Response("Missing email address", { status: 400 });

  const domain = sliceFrom(email, "@");
  if (!domain) return new Response("Malformed email address", { status: 400 });

  const result = dedent`
    <?xml version="1.0" encoding="UTF-8"?>
    <clientConfig version="1.1">
      <emailProvider id="purelymail.com">
        <domain>${domain}</domain>
        <displayName>Purelymail</displayName>
        <displayShortName>Purelymail</displayShortName>

        <incomingServer type="imap">
          <hostname>imap.purelymail.com</hostname>
          <port>993</port>
          <socketType>SSL</socketType>
          <username>%EMAILADDRESS%</username>
          <authentication>password-cleartext</authentication>
        </incomingServer>

        <incomingServer type="pop3">
          <hostname>pop3.purelymail.com</hostname>
          <port>995</port>
          <socketType>SSL</socketType>
          <username>%EMAILADDRESS%</username>
          <authentication>password-cleartext</authentication>
        </incomingServer>

        <outgoingServer type="smtp">
          <hostname>smtp.purelymail.com</hostname>
          <port>465</port>
          <socketType>SSL</socketType>
          <username>%EMAILADDRESS%</username>
          <authentication>password-cleartext</authentication>
        </outgoingServer>
      </emailProvider>
    </clientConfig>
  `;

  return new Response(result, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
