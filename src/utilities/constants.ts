export const CREATE = 'create';
export const READ = 'read';
export const UPDATE = 'update';

export const roles = {
  reader: { can: ['*:read'] },
  author: { can: ['post:*', 'page:*'] },
  // editor: { can: ['user:*'], inherits: ['editor', 'reader'] },
  admin: { can: ['*'] },
};
