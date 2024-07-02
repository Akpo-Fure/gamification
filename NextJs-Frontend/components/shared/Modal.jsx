import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

const CenteredModal = ({ show, onHide, size, header, footer, children }) => {
  return (
    <Modal show={show} onHide={onHide} centered size={size ?? "lg"}>
      <Modal.Header closeButton>{header}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  );
};

CenteredModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  size: PropTypes.string,
  header: PropTypes.element.isRequired,
  footer: PropTypes.element,
  children: PropTypes.element.isRequired,
};

export { CenteredModal };
