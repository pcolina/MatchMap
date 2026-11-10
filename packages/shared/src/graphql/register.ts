export const registerMutation = `mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    email
    createdAt
  }
}
`;
