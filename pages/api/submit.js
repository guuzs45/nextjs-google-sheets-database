import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Inscrições";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Método não permitido" });
    return;
  }

  const { nome, classe, ip } = req.body;

  if (!nome || !classe || !ip) {
    res.status(400).json({ message: "Campos incompletos" });
    return;
  }

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nome, classe, ip, new Date().toLocaleString("pt-BR")]],
      },
    });

    res.status(200).json({ message: "Inscrição salva com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar inscrição:", error);
    res.status(500).json({ message: "Erro ao salvar inscrição" });
  }
}
