import PropTypes from 'prop-types';

/**
 * 
 * @param {{children: any, onClick: function }} props 
 * @returns 
 */
export default function Button({ children = null, onClick = () => {} }) {

    return (
        <>
            <button className="btn btn-primary" onClick={onClick}>{children}</button>
        </>
    );
}

Button.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
}
