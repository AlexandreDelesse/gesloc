import { useNavigate } from 'react-router';
import PageLayout from '../components/layout/PageLayout';
import PropertyForm from '../features/property/components/PropertyForm';
import { useCreateProperty } from '../features/property/hooks/useCreateProperty';
import type { CreatePropertyData } from '../features/property/types/property.types';

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const { mutate: createProperty, isPending } = useCreateProperty();

  const handleSubmit = (data: CreatePropertyData) => {
    createProperty(data, {
      onSuccess: (created) => navigate(`/property/${created.id}`),
    });
  };

  return (
    <PageLayout title="Nouveau bien">
      <PropertyForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isLoading={isPending}
        submitLabel="Ajouter"
      />
    </PageLayout>
  );
};

export default CreatePropertyPage;
