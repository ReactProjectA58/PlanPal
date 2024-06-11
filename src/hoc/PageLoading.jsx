import { useState, useEffect } from "react";
import LoadingSpinner from "../components/Loading/LoadingSpinner";

export default function withLoading(Component) {
  return (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 400);

      return () => clearTimeout(timer);
    }, []);

    return loading ? <LoadingSpinner /> : <Component {...props} />;
  };
}
