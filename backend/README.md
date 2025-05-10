# Database Management Guide

## Overview
This guide explains how to manage and share database changes in the project.

## Database Structure
- We use SQLite for development
- Database file: `database.sqlite` (DO NOT commit this file)
- Schema changes are managed through migrations
- Data changes are managed through seeders

## Making Database Changes

### 1. Schema Changes (Migrations)
When you need to modify the database structure:
```bash
# Create a new migration
npx sequelize-cli migration:generate --name your_migration_name

# Run migrations
npx sequelize-cli db:migrate

# Undo last migration if needed
npx sequelize-cli db:migrate:undo
```

### 2. Data Changes (Seeders)
When you need to share new data with the team:

1. Create a new seed file:
```bash
npx sequelize-cli seed:generate --name your_seed_name
```

2. Add your data to the seed file (example):
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TableName', [
      {
        // your data here
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // cleanup code here
  }
};
```

3. Test the seed file locally:
```bash
npx sequelize-cli db:seed --seed your_seed_name.js
```

4. Commit and push the seed file:
```bash
git add backend/seeders/your_seed_name.js
git commit -m "Add new data: description"
git push
```

## For Team Members

When you pull changes that include new database updates:

1. Pull the latest changes:
```bash
git pull
```

2. Run any new migrations:
```bash
npx sequelize-cli db:migrate
```

3. Run any new seed files:
```bash
npx sequelize-cli db:seed --seed your_seed_name.js
```

## Important Rules

1. **NEVER commit:**
   - database.sqlite file
   - exported JSON files
   - sensitive data

2. **ALWAYS commit:**
   - migration files
   - seed files
   - schema changes

3. **Best Practices:**
   - Name seed files with timestamp and description
   - Include both up and down methods in seeders
   - Test seeders locally before committing
   - Document what each seeder does

## Common Issues

1. **Duplicate Data:**
   - Use unique constraints in migrations
   - Clean up duplicates in seeders before inserting

2. **Missing Dependencies:**
   - Ensure referenced data exists before inserting
   - Order your seeders correctly

3. **Data Conflicts:**
   - Use specific IDs in seeders
   - Include cleanup in down methods

## Need Help?

If you encounter any issues:
1. Check the migration/seed file for errors
2. Verify the database schema
3. Ask the team for assistance 