import { GoogleSpreadsheet } from 'google-spreadsheet';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { nome, classe, ip } = req.body;

  if (!nome || !classe || !ip) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY,
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Inscrições'];
    if (!sheet) {
      return res.status(404).json({ message: 'Aba "Inscrições" não encontrada' });
    }

    await sheet.addRow({
      Nome: nome,
      Classe: classe,
      IP: ip,
      Data: new Date().toLocaleString('pt-BR'),
    });

    return res.status(200).json({ message: 'Inscrição registrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar inscrição:', error);
    return res.status(500).json({ message: 'Erro ao registrar inscrição.' });
  }
}
