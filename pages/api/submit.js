import { GoogleSpreadsheet } from "google-spreadsheet";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Inscrições";

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
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Autenticar com a chave do serviço (JSON string ou objeto)
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo(); // carrega as informações da planilha
    const sheet = doc.sheetsByTitle[SHEET_NAME];
    if (!sheet) {
      return res.status(500).json({ message: `Aba '${SHEET_NAME}' não encontrada.` });
    }

    // Adiciona uma nova linha
    await sheet.addRow({
      Nome: nome,
      Classe: classe,
      IP: ip,
      Data: new Date().toLocaleString("pt-BR"),
    });

    res.status(200).json({ message: "Inscrição salva com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar inscrição:", error);
    res.status(500).json({ message: "Erro ao salvar inscrição" });
  }
}
