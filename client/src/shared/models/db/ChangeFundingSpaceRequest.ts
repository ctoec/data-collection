export interface ChangeFundingSpaceRequest {
  id: number;
  organizationId: number;
  authorId: number;
  createdAt: Date;
  fundingSpace: string;
  fundingSpaceId?: number;
  shouldHave: boolean;
}
