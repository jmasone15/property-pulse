'use client';
import Spinner from '@/components/Spinner';

const LoadingPage = ({ loading }) => {
	return <Spinner loading={loading} />;
};
export default LoadingPage;
