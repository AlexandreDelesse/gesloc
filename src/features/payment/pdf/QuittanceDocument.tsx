import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Payment } from '../types/payment.types';
import { formatPeriod, getPaymentTotal } from '../types/payment.types';
import type { Tenancy } from '../../tenancy/types/tenancy.types';
import type { Property } from '../../property/types/property.types';

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 60,
    color: '#1a1a1a',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  period: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 14,
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
    width: 200,
    flexShrink: 0,
  },
  value: {
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 200,
    flexShrink: 0,
    fontSize: 11,
  },
  totalValue: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  mention: {
    marginTop: 30,
    fontSize: 9,
    color: '#555',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    fontSize: 8,
    color: '#aaa',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 6,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// ─── Document component ───────────────────────────────────────────────────────

interface QuittanceDocumentProps {
  payment: Payment;
  tenancy: Tenancy;
  property: Property;
}

const QuittanceDocument = ({ payment, tenancy, property }: QuittanceDocumentProps) => {
  const total = getPaymentTotal(payment);
  const ownerFullName = `${property.owner.firstName} ${property.owner.lastName}`;
  const tenantFullName = `${tenancy.tenant.firstName} ${tenancy.tenant.lastName}`;
  const propertyAddress = `${property.address.street}, ${property.address.postCode} ${property.address.city}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Quittance de loyer</Text>
        <Text style={styles.period}>{formatPeriod(payment.period)}</Text>

        {/* Bailleur */}
        <Text style={styles.sectionTitle}>Bailleur</Text>
        <Row label="Nom :" value={ownerFullName} />
        {property.owner.address && (
          <Row
            label="Adresse :"
            value={`${property.owner.address.street}, ${property.owner.address.postCode} ${property.owner.address.city}`}
          />
        )}

        {/* Locataire */}
        <Text style={styles.sectionTitle}>Locataire</Text>
        <Row label="Nom :" value={tenantFullName} />
        {tenancy.tenant.address && (
          <Row
            label="Adresse :"
            value={`${tenancy.tenant.address.street}, ${tenancy.tenant.address.postCode} ${tenancy.tenant.address.city}`}
          />
        )}

        {/* Bien */}
        <Text style={styles.sectionTitle}>Logement</Text>
        <Row label="Adresse :" value={propertyAddress} />
        {property.building && <Row label="Bâtiment :" value={property.building} />}
        {property.apartmentNumber && <Row label="N° appartement :" value={property.apartmentNumber} />}
        <Row label="Surface :" value={`${property.surface} m²`} />

        {/* Montants */}
        <Text style={styles.sectionTitle}>Détail du règlement</Text>
        <Row label="Loyer hors charges :" value={`${payment.rentAmount} €`} />
        <Row label="Charges :" value={`${payment.chargesAmount} €`} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total réglé :</Text>
          <Text style={styles.totalValue}>{total} €</Text>
        </View>

        {payment.paidAt && (
          <>
            <Row label="" value="" />
            <Row label="Date de paiement :" value={formatDate(payment.paidAt)} />
          </>
        )}

        {/* Mention légale */}
        <Text style={styles.mention}>
          Je soussigné(e) {ownerFullName}, bailleur, donne quittance à {tenantFullName} pour le
          paiement de la somme de {total} € correspondant au loyer et aux charges du mois de{' '}
          {formatPeriod(payment.period)} pour le logement sis {propertyAddress}.{'\n'}
          Cette quittance annule tous reçus ou acomptes précédemment délivrés.
        </Text>

        <Text style={styles.footer}>
          Document généré le {new Date().toLocaleDateString('fr-FR')}
        </Text>
      </Page>
    </Document>
  );
};

export default QuittanceDocument;
