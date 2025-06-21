// This file's purpose is to import all models,
// ensuring they are registered with Mongoose before any database operations.

import "./Product";
import "./User";
import "./Order";
import "./Blog";

// We don't need to export anything. The act of importing these files
// is enough to trigger the model registration in each file.
