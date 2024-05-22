import PropTypes from 'prop-types';

function UploadButton({ onFileChange }) {
  return (
    <div className="avatar-upload">
      <input
        type="file"
        id="avatarInput"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
      <label htmlFor="avatarInput" className="btn btn-primary">
        Upload Avatar
      </label>
    </div>
  );
}

UploadButton.propTypes = {
  onFileChange: PropTypes.func,
};

export default UploadButton;