import ConfirmClient from './ConfirmClient';

type ConfirmPageProps = {
  searchParams: {
    client?: string;
    uploadUrl?: string;
  };
};

export default function ConfirmUploadPage({ searchParams }: ConfirmPageProps) {
  return (
    <ConfirmClient
      client={searchParams.client || 'Client'}
      uploadUrl={searchParams.uploadUrl || ''}
    />
  );
}
