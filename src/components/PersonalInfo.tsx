export default function PersonalInfo() {
  return (
    <div>
      <h2 style={{ marginTop: 0, fontSize: '18px' }}>Biagio Scaglia</h2>
      <fieldset>
        <legend>Dati Anagrafici</legend>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Data di nascita:</strong> 19/11/2004</p>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Luogo di nascita:</strong> Bari, Italia</p>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Nazionalità:</strong> Italiana</p>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Residenza:</strong> Modugno, Italia</p>
      </fieldset>
      <fieldset style={{ marginTop: '16px' }}>
        <legend>Contatti</legend>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Telefono:</strong> (+39) 3513150134</p>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Email:</strong> biagio.scaglia01@gmail.com</p>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>LinkedIn:</strong> Biagio Scaglia</p>
        <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>WhatsApp:</strong> +393513150134</p>
      </fieldset>
      <fieldset style={{ marginTop: '16px' }}>
        <legend>Nota</legend>
        <p style={{ margin: '6px 0', fontSize: '13px' }}>
          Non offro servizi e non vendo prodotti.
        </p>
      </fieldset>
    </div>
  )
}

