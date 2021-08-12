import { Spinner } from "react-bootstrap"

const LoadingComponent: React.FC = () => {
    return (
        <div className="d-flex justify-content-center">
            <Spinner variant="primary" animation="grow" style={{ animationDelay: '.3s' }} />
            <Spinner variant="primary" animation="grow" />
            <Spinner variant="primary" animation="grow" style={{ animationDelay: '.3s' }} />
        </div>
    )
}

export default LoadingComponent