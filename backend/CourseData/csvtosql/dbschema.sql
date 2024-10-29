CREATE TABLE "Courses" (
    list_num SERIAL PRIMARY KEY,
    "Subject" TEXT,
    "Course ID" TEXT NOT NULL,
    "Course Title" TEXT NOT NULL,
    "Course Description" TEXT,
    "Credits" TEXT,
    "Campus" TEXT
);