import * as migration_20260222_230637_add_api_key_to_users from './20260222_230637_add_api_key_to_users';

export const migrations = [
  {
    up: migration_20260222_230637_add_api_key_to_users.up,
    down: migration_20260222_230637_add_api_key_to_users.down,
    name: '20260222_230637_add_api_key_to_users'
  },
];
