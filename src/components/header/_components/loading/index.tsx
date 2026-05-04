const LoadingUser = ({ isLoading }: { isLoading: boolean }) => {
    if (!isLoading) return null;

    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
};

export default LoadingUser;
