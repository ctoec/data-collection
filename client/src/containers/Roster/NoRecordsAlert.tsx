import { Alert } from "@ctoec/component-library";
import React from "react";
import { AddRecordButton } from "../../components/AddRecordButton";
import { Organization } from "../../shared/models";

export const NoRecordsAlert = (props: {organizations: Organization[]}) => (
	<Alert
		heading="No records in your roster"
		type="info"
		text="Get started by adding records to your roster"
		actionItem={
			<AddRecordButton
				orgs={props.organizations}
				id="add-record-in-alert"
			/>
		}
	/>
);
