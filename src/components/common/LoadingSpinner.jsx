
const LoadingSpinner = ({ size = "h-8 w-8", className = "" }) => (
    <div className={`animate-spin rounded-full border-b-2 border-emerald-500 ${size} ${className}`} />
);
export default LoadingSpinner;