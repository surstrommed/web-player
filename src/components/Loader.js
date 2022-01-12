import { Button, Spinner } from "react-bootstrap";

export const Loader = () => {
  return (
    <Button
      className="d-block mx-auto mt-5 text-center"
      variant="dark"
      disabled
    >
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Loading...
    </Button>
  );
};
