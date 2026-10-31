import type { Metadata } from "next";
export const metadata: Metadata = { title: "Für Große" };

export default function ForGrownUps() {
  return (
    <div className="wrap page">
      <h1>Für Große</h1>
      <section className="panel">
        <h2>Die Idee</h2>
        <p>Ein Thema pro Tag, fünf bis acht Minuten, gemeinsam. Vorlesen, Bild anschauen, etwas ausprobieren, darüber reden. Es gibt keine Punkte und keine Serien, und niemand muss etwas leisten. Falsche Vermutungen sind Gesprächsanlässe.</p>
        <p>Höchstens vier von zehn Häppchen drehen sich um Mathematik, Naturwissenschaft oder Technik. Der Rest gehört Sprache, Denken, Geschichte, Kulturen, Gefühlen und dem Alltag.</p>
      </section>
      <section className="panel">
        <h2>Vorlesen</h2>
        <p>Die Vorlesefunktion spielt eine fertige Aufnahme ab, gesprochen von der Computerstimme Thorsten. Sie liest nur die Passagen fürs Kind, nie die Lösung oder die Quellen. Die Stimme klingt auf jedem Gerät gleich und braucht eine Internetverbindung.</p>
      </section>
      <section className="panel">
        <h2>Merken und entdeckt</h2>
        <p>Merken ist ein Lesezeichen. „Gemeinsam entdeckt“ setzt ihr selbst und könnt es zurücknehmen. Nur so bestätigte Themen tauchen später in Wiederholungsfragen auf. Das Öffnen eines Häppchens zählt nie.</p>
        <p>Beides bleibt nur in diesem Browser auf diesem Gerät. Es wird nirgends hingeschickt, und ein anderes Gerät sieht es nicht.</p>
      </section>
      <section className="panel">
        <h2>Zum Home-Bildschirm</h2>
        <p><strong>iPhone/iPad (Safari):</strong> Teilen-Symbol antippen, dann „Zum Home-Bildschirm“.</p>
        <p><strong>Android (Chrome):</strong> Menü mit den drei Punkten, dann „App installieren“ oder „Zum Startbildschirm hinzufügen“.</p>
        <p>Bereits geöffnete Häppchen lassen sich meist auch ohne Netz wieder anschauen. Neue Ausgaben brauchen immer eine Verbindung.</p>
      </section>
      <section className="panel">
        <h2>Woher die Häppchen kommen</h2>
        <p>Jeden Morgen kurz nach 7 Uhr schreibt Claude ein neues Häppchen und zeichnet das Bild dazu. Veröffentlicht wird es nur, wenn alle Prüfungen bestehen: Sicherheit der Mitmachidee, Themenmix und wörtliche Belege aus den genannten Quellen. Klappt das nicht, bleibt die letzte Ausgabe mit ihrem echten Datum stehen.</p>
        <p>Die Texte sind KI-erzeugt und werden nicht von Menschen gegengelesen. Schaut bei überraschenden Aussagen gern selbst in die Quellen.</p>
        <p>Die Seite ist öffentlich erreichbar, wenn jemand die Adresse kennt. Sie enthält keine Angaben zu eurer Familie.</p>
      </section>
    </div>
  );
}
