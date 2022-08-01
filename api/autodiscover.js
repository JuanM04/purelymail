import dedent from "dedent";

export const config = {
  runtime: "experimental-edge",
};

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export default async function autodiscover(request) {
  const body = await request.text();

  const email = /<EMailAddress>(.*?)<\/EMailAddress>/g.exec(body)?.[1];
  if (!email) return new Response("Missing email address", { status: 400 });

  const result = dedent`
    <?xml version="1.0" encoding="UTF-8"?>
    <Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/responseschema/2006">
      <Response xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a">
        <Account>
          <AccountType>email</AccountType>
          <Action>settings</Action>

          <Protocol>
            <Type>IMAP</Type>
            <Server>imap.purelymail.com</Server>
            <Port>993</Port>
            <LoginName>${email}</LoginName>
            <SSL>on</SSL>
            <AuthRequired>on</AuthRequired>
          </Protocol>

          <Protocol>
            <Type>SMTP</Type>
            <Server>smtp.purelymail.com</Server>
            <Port>465</Port>
            <LoginName>${email}</LoginName>
            <SSL>on</SSL>
            <AuthRequired>on</AuthRequired>
          </Protocol>
        </Account>
      </Response>
    </Autodiscover>
  `;

  return new Response(result, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
