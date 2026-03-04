import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Tenancy } from '../types/tenancy.types';
import { getTenancyEndDate } from '../types/tenancy.types';
import type { Property } from '../../property/types/property.types';

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 50,
    color: '#1a1a1a',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginTop: 16,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 3,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    fontFamily: 'Helvetica-Bold',
    width: 180,
    flexShrink: 0,
  },
  value: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 4,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    color: '#888',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 6,
  },
  signatureBlock: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    minHeight: 80,
  },
  signatureLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    marginBottom: 4,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const legalFrameworkLabels: Record<string, string> = {
  'meublé-loi-89': 'Meublée – Titre Ier bis, loi du 6 juillet 1989',
  'vide-loi-89': 'Non meublée – Titre Ier, loi du 6 juillet 1989',
  autre: 'Autre',
};

const chargesTypeLabels: Record<string, string> = {
  forfait: 'Forfait (non révisable)',
  provision: 'Provision avec régularisation annuelle',
};

// ─── Document component ───────────────────────────────────────────────────────

interface BailDocumentProps {
  tenancy: Tenancy;
  property: Property;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const BailDocument = ({ tenancy, property }: BailDocumentProps) => {
  const endDate = getTenancyEndDate(tenancy);
  const total = tenancy.rentAmount + tenancy.chargesAmount;

  const ownerFullName = `${property.owner.firstName} ${property.owner.lastName}`;
  const tenantFullName = `${tenancy.tenant.firstName} ${tenancy.tenant.lastName}`;
  const propertyAddress = `${property.address.street}, ${property.address.postCode} ${property.address.city}`;
  const titleLabel =
    tenancy.legalFramework === 'meublé-loi-89'
      ? 'CONTRAT DE LOCATION MEUBLÉE'
      : tenancy.legalFramework === 'vide-loi-89'
        ? 'CONTRAT DE LOCATION NON MEUBLÉE'
        : 'CONTRAT DE LOCATION';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <Text style={styles.title}>{titleLabel}</Text>
        <Text style={styles.subtitle}>
          {legalFrameworkLabels[tenancy.legalFramework] ?? tenancy.legalFramework}
        </Text>

        {/* Parties */}
        <Text style={styles.sectionTitle}>1. Parties</Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Le bailleur :</Text>
          {'\n'}
          {ownerFullName}
          {property.owner.address
            ? `\n${property.owner.address.street}, ${property.owner.address.postCode} ${property.owner.address.city}`
            : ''}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Le preneur :</Text>
          {'\n'}
          {tenantFullName}
          {tenancy.tenant.address
            ? `\n${tenancy.tenant.address.street}, ${tenancy.tenant.address.postCode} ${tenancy.tenant.address.city}`
            : ''}
        </Text>
        {tenancy.guarantor && (
          <Text style={styles.paragraph}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>La caution :</Text>
            {'\n'}
            {tenancy.guarantor.firstName} {tenancy.guarantor.lastName}
            {tenancy.guarantor.address
              ? `\n${tenancy.guarantor.address.street}, ${tenancy.guarantor.address.postCode} ${tenancy.guarantor.address.city}`
              : ''}
          </Text>
        )}

        {/* Bien loué */}
        <Text style={styles.sectionTitle}>2. Bien loué</Text>
        <Row label="Adresse :" value={propertyAddress} />
        {property.building && <Row label="Bâtiment :" value={property.building} />}
        {property.apartmentNumber && (
          <Row label="N° appartement :" value={property.apartmentNumber} />
        )}
        <Row label="Surface :" value={`${property.surface} m²`} />
        {property.roomCount && <Row label="Nombre de pièces :" value={String(property.roomCount)} />}
        {property.buildingType && (
          <Row
            label="Type d'immeuble :"
            value={property.buildingType === 'collectif' ? 'Immeuble collectif' : 'Maison individuelle'}
          />
        )}
        {property.legalRegime && (
          <Row
            label="Régime juridique :"
            value={
              property.legalRegime === 'copropriété'
                ? 'Copropriété'
                : property.legalRegime === 'monopropriété'
                  ? 'Monopropriété'
                  : 'Autre'
            }
          />
        )}
        <Row
          label="Destination :"
          value={tenancy.propertyUse === 'habitation' ? 'Habitation principale' : 'Usage mixte'}
        />

        {/* Durée */}
        <Text style={styles.sectionTitle}>3. Durée du contrat</Text>
        <Row label="Date de prise d'effet :" value={formatDate(tenancy.startDate)} />
        <Row label="Durée :" value={`${tenancy.durationMonths} mois`} />
        <Row label="Date d'échéance :" value={formatDate(endDate.toISOString().split('T')[0])} />

        {/* Conditions financières */}
        <Text style={styles.sectionTitle}>4. Conditions financières</Text>
        <Row label="Loyer mensuel hors charges :" value={`${tenancy.rentAmount} €`} />
        <Row label="Charges mensuelles :" value={`${tenancy.chargesAmount} €`} />
        <Row label="Type de charges :" value={chargesTypeLabels[tenancy.chargesType] ?? tenancy.chargesType} />
        <Row label="Total mensuel :" value={`${total} €`} />
        <Row label="Jour limite de paiement :" value={`Le ${tenancy.paymentDueDay} de chaque mois`} />
        <Row label="Dépôt de garantie :" value={`${tenancy.securityDeposit} €`} />

        {/* Signatures */}
        <Text style={styles.sectionTitle}>5. Signatures</Text>
        <Text style={[styles.paragraph, { marginBottom: 8 }]}>
          Fait en deux exemplaires originaux, à __________________, le __________________.
        </Text>
        <View style={styles.signatureBlock}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Le bailleur</Text>
            <Text style={{ fontSize: 9, color: '#555' }}>{ownerFullName}</Text>
            <Text style={{ fontSize: 9, color: '#aaa', marginTop: 30 }}>Signature :</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Le(s) preneur(s)</Text>
            <Text style={{ fontSize: 9, color: '#555' }}>{tenantFullName}</Text>
            <Text style={{ fontSize: 9, color: '#aaa', marginTop: 30 }}>Signature :</Text>
          </View>
        </View>

        {/* Pied de page */}
        <Text style={styles.footer}>
          Document généré le {new Date().toLocaleDateString('fr-FR')} — Contrat de location soumis à la loi n°89-462 du 6 juillet 1989
        </Text>
      </Page>
    </Document>
  );
};

export default BailDocument;
