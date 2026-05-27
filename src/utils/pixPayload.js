/**
 * Gerador de payload PIX estático (EMV QR Code — padrão Banco Central do Brasil)
 */

function tlv(id, value) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

function crc16(str) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * @param {object} params
 * @param {string} params.chave     — Chave PIX (e-mail, CPF, CNPJ, telefone, EVP)
 * @param {string} params.nome      — Nome do recebedor (máx 25 chars)
 * @param {string} params.cidade    — Cidade do recebedor (máx 15 chars)
 * @param {number} [params.valor]   — Valor em reais (opcional; 0 = sem valor fixo)
 * @param {string} [params.descricao] — Descrição/info adicional (máx 99 chars)
 * @returns {string} payload pronto para gerar QR Code
 */
export function gerarPixPayload({ chave, nome, cidade, valor = 0, descricao = '' }) {
  const gui = tlv('00', 'BR.GOV.BCB.PIX')
  const pixKey = tlv('01', chave)
  const info = descricao ? tlv('02', descricao.substring(0, 99)) : ''
  const merchantInfo = tlv('26', gui + pixKey + info)

  let payload = '000201'           // Payload Format Indicator
  payload += merchantInfo          // Merchant Account Info
  payload += '52040000'            // Merchant Category Code
  payload += '5303986'             // Moeda BRL
  if (valor > 0) {
    payload += tlv('54', valor.toFixed(2))
  }
  payload += '5802BR'              // País
  payload += tlv('59', nome.substring(0, 25))
  payload += tlv('60', cidade.substring(0, 15))
  payload += tlv('62', tlv('05', '***'))  // Dados adicionais
  payload += '6304'                // CRC tag (valor calculado abaixo)

  return payload + crc16(payload)
}
