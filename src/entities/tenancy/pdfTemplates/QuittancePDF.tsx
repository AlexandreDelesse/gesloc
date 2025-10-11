import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

interface Props {}

//TODO: A terminer
function QuittancePDF(props: Props) {
  const {} = props;

  const styles = StyleSheet.create({
    page: { padding: 50, display: "flex", flexDirection: "column", gap: 30 },
    title: {
      textAlign: "center",
      fontSize: 24,
      marginBottom: 50,
    },
    section: { fontSize: 14 },
    leftSection: { alignSelf: "flex-start" },
    rightSection: {
      alignSelf: "flex-end",
      fontSize: 14,
    },
    text: { fontSize: 14 },
    textRight: { alignSelf: "flex-end" },
    subTitles: { fontWeight: "bold" },
  });

  return (
    <Document>
      <Page style={styles.page} size="A4">
        {/* Titre du document */}
        <Text style={styles.title}>
          Quittance de loyer octobre 2025
        </Text>

        {/* Section proprietaire */}
        <View style={styles.section}>
          <Text>Chantal NOTARIANNI</Text>
          <Text>19 rue Marius Touzet</Text>
          <Text>13090 Aix-en-Provence</Text>
        </View>

        {/* Section locataire */}
        <View style={styles.rightSection}>
          <Text style={styles.textRight}>TUIZIR Elisa</Text>
          <Text style={styles.textRight}>
            Avenue de la marne, les hauts cepages
          </Text>
          <Text style={styles.textRight}>13260 Cassis</Text>
        </View>

        {/* Section logement */}
        <View style={styles.section}>
          <Text style={styles.subTitles}>Adresse de la location :</Text>
          <Text>1600 route des milles la parade</Text>
          <Text>13090 Aix-en-Provence</Text>
        </View>

        {/* Section Contenue  */}
        <Text style={styles.text}>
          Je soussigné NOTARIANNI Chantal propriétaire du logement désigné
          ci-dessus, déclare avoir reçu de Madame TUIZIR Elisa, la somme de 800
          euros (Huit cents euros), au titre du paiement du loyer et des charges
          pour la période de location du 01/10/2025 au 31/10/2025 et lui en
          donne quittance, sous réserve de tous mes droits.
        </Text>

        {/* Section détail du reglement */}
        <View style={styles.section}>
          <Text style={styles.subTitles}>Détail du règlement :</Text>
          <Text>Loyer : 750€</Text>
          <Text>Charges : 50€ </Text>
          <Text style={{...styles.subTitles, marginTop: 8}}>Total : 800€</Text>
          <Text>Date du paiement : 01/10/2025</Text>
        </View>
      </Page>
    </Document>
  );
}

export default QuittancePDF;
