import React, { useState, useContext, useEffect } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useParams } from 'react-router-dom';
import { Alert } from '@ctoec/component-library';

const EXPECTED_HEADERS = [
	'SASID','Name','Date of birth','Birth certificate ID #','Town of birth','State of birth','Race','Ethnicity','Gender','Receiving Special Education Services','Special Education Services Type','Address','Lives with foster family','Experienced homelessness or housing insecurity','Household size','Annual household income','Determination date','Enrollment Start Date','Enrollment End Date','Enrollment Exit Reason','First funding period','Last funding period','Site','Age Group','Funding Type','Space type','Model','Receiving Care 4 Kids?'
];

const CheckData: React.FC = () => {
	const { fileUploadId } = useParams();
	if(!fileUploadId) {
		throw new Error("fileUploadId is required");
	}

	const { accessToken } = useContext(AuthenticationContext);

	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<string>();
	const [error, setError] = useState<string>();

	// get uploaded data
	useEffect(() => {
		if (!accessToken) return;
		if (loading) return;
		if (error) return;
		if (data) return;

		setLoading(true);
		fetch(`/api/reports/${fileUploadId}`, {
			headers: {
				authorization: `Bearer ${accessToken}`
			}
		})
		.then(value => value.text())
		.then(value => {
			console.log("value", value)
			setData(value)
		})
		.catch((_) => {
			console.error(_);
			setError("There was an error");
		})
		.finally(() => setLoading(false));
		
	}, [accessToken, loading, error, data, fileUploadId]);

	console.log("data", data);

	if(loading) {
		return <> Loading...</>;
	}

	const headers = getHeaders(data);
	return (
		<div className="grid-container margin-top-4">
			{JSON.stringify(headers) === JSON.stringify(EXPECTED_HEADERS)
				? <Alert type="success" text="Uploaded data looks good!" />
				: <Alert type="error" text="Uploaded data does not match expected format" />
			}
			<div className="grid-row">
				<div className="grid-col-6"> 
					Expected data fields:
					<ul>
					 {EXPECTED_HEADERS.map((h) => <li>{h}</li>)}
					</ul>
				</div>

				<div className="grid-col-6">
					Uploaded data fields:
					<ul>
					 {(headers || []).map((h) => <li>{h}</li>)}
					</ul>
				</div>
			</div>

		</div>
	)
}

const getHeaders = (rawCsv: string | undefined) => {
	if(!rawCsv) return [];

	const rows = rawCsv.split('\n');
	if (!rows || !rows.length)  return [];

	return rows[0].split(',').map((header) => header.trim())
}

export default CheckData;
