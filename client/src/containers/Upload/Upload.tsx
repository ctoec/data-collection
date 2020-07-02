import React, { useRef, useEffect, useState, useContext } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';

const Upload: React.FC = () => {
	const { accessToken } = useContext(AuthenticationContext);
	const [status, setStatus] = useState<any>();
	const formData = new FormData();

	const onSubmit = (e: any) => {
		e.preventDefault();
	
		fetch('/api/reports', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${accessToken}`
			},
			body: formData
		})
		.then(value => value.json())
		.then(value => setStatus(value))
		.catch(_ => setStatus({
			error: true,
			message: 'There was an error'
		}));
		e.persist();
		
		return false;
	}
	const fileUpload = (e: any) => {
		e.preventDefault();
		if (!e.target.files) {
			return;
		}
		const file = e.target.files[0];
		formData.delete("file");
		formData.set("file", file);
		return false;
	}
	return (
		<>
			<p>{status && status.message}</p>
			<form onSubmit={onSubmit}>
				<label htmlFor="file"></label>
				<input name="file" type="file" onChange={fileUpload} />
				<button type="submit">Submit</button>
			</form>
		</>
	)
};

export default Upload;