export interface ChangeFundingSpaceRequest {
  id: number;
  organizationId: number;
  fundingSpace: string;
  shouldHave: boolean;
}
