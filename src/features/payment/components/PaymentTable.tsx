import {
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Tenancy } from '../../tenancy/types/tenancy.types';
import type { Property } from '../../property/types/property.types';
import {
  formatPeriod,
  getPaymentTotal,
  isPaymentLate,
  type Payment,
} from '../types/payment.types';
import { usePaymentsByTenancy } from '../hooks/usePaymentsByTenancy';
import { useUpdatePayment } from '../hooks/useUpdatePayment';
import { downloadQuittancePdf } from '../pdf/QuittanceDocument';

interface Props {
  tenancyId: string;
  tenancy: Tenancy;
  property: Property | null;
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const PaymentTable = ({ tenancyId, tenancy, property }: Props) => {
  const { data: payments, isLoading } = usePaymentsByTenancy(tenancyId);
  const { mutate: updatePayment, isPending: isUpdating } = useUpdatePayment(tenancyId);

  if (isLoading) return <CircularProgress size={24} sx={{ display: 'block', mx: 'auto' }} />;

  if (!payments || payments.length === 0) {
    return (
      <Typography color="text.secondary" fontSize={14}>
        Aucune échéance enregistrée.
      </Typography>
    );
  }

  const handleMarkPaid = (payment: Payment) => {
    updatePayment({
      id: payment.id,
      status: 'payé',
      paidAt: new Date().toISOString(),
    });
  };

  const handleDownloadQuittance = (payment: Payment) => {
    if (!property) return;
    downloadQuittancePdf(payment, tenancy, property);
  };

  const getStatusChip = (payment: Payment) => {
    if (payment.status === 'payé') {
      return <Chip label="Payé" color="success" size="small" />;
    }
    if (isPaymentLate(payment)) {
      return <Chip label="En retard" color="error" size="small" />;
    }
    return <Chip label="En attente" color="warning" size="small" />;
  };

  // Sort by period ascending
  const sorted = [...payments].sort((a, b) => a.period.localeCompare(b.period));

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Période</TableCell>
          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Loyer HC</TableCell>
          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Charges</TableCell>
          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Échéance</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((payment) => (
          <TableRow key={payment.id} hover>
            <TableCell>{formatPeriod(payment.period)}</TableCell>
            <TableCell align="right">{payment.rentAmount} €</TableCell>
            <TableCell align="right">{payment.chargesAmount} €</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
              {getPaymentTotal(payment)} €
            </TableCell>
            <TableCell>{formatDate(payment.dueDate)}</TableCell>
            <TableCell>{getStatusChip(payment)}</TableCell>
            <TableCell>
              {payment.status !== 'payé' && (
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleMarkPaid(payment)}
                  disabled={isUpdating}
                  sx={{ mr: 1 }}
                >
                  Payé
                </Button>
              )}
              {payment.status === 'payé' && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  onClick={() => handleDownloadQuittance(payment)}
                  disabled={!property}
                >
                  Quittance
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PaymentTable;
