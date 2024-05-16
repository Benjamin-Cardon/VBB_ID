CREATE TABLE IF NOT EXISTS public.patrons
(
    patron_id character varying(255) COLLATE pg_catalog."default" PRIMARY KEY NOT NULL,
    library_id bigint NOT NULL,
    first_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    gender character varying(255) COLLATE pg_catalog."default" NOT NULL,
    date_of_birth date,
    grade_level integer,
    immediate_family_members integer,
    family_status character varying(255) COLLATE pg_catalog."default" NOT NULL,
    family_members_with_income integer,
    barriers_to_education character varying(255) COLLATE pg_catalog."default" NOT NULL,
    family_support_level integer,
    favorite_subject character varying(255) COLLATE pg_catalog."default" NOT NULL,
    percieved_most_useful_subject character varying(255) COLLATE pg_catalog."default" NOT NULL,
    percieved_most_difficult_subject character varying(255) COLLATE pg_catalog."default" NOT NULL,
    library_discovery_method character varying(255) COLLATE pg_catalog."default" NOT NULL,
    library_travel_time character varying(255) COLLATE pg_catalog."default" NOT NULL,
    desired_library_resources character varying(255) COLLATE pg_catalog."default" NOT NULL,
    library_attendance_goal character varying(255) COLLATE pg_catalog."default" NOT NULL
);

CREATE TABLE IF NOT EXISTS public.librarians
(
    id bigserial NOT NULL,
    platform_user_id bigint,
    library_id bigint NOT NULL,
    password character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default",
    first_name character varying(255) COLLATE pg_catalog."default",
    last_name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    current_librarian boolean
);

CREATE TABLE IF NOT EXISTS public.attendance_log
(
  id bigserial NOT NULL,
  patron_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
  library_id bigint NOT NULL,
  time_attended date
);

CREATE TABLE IF NOT EXISTS public.libraries
(
    id bigserial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address_1 character varying(255) COLLATE pg_catalog."default",
    address_2 character varying(255) COLLATE pg_catalog."default",
    city character varying(255) COLLATE pg_catalog."default",
    country character varying(255) COLLATE pg_catalog."default",
    notes character varying(255) COLLATE pg_catalog."default",
    "poBoxNumber" character varying(255) COLLATE pg_catalog."default",
    postal_code character varying(255) COLLATE pg_catalog."default",
    state_province character varying(255) COLLATE pg_catalog."default"
);

ALTER TABLE librarians
ADD CONSTRAINT pk_librarians_id PRIMARY KEY (id);

ALTER TABLE librarians
ADD CONSTRAINT fk_librarians_belong_to_libraries FOREIGN KEY (library_id) REFERENCES libraries(id)

ALTER TABLE patrons
ADD CONSTRAINT fk_patrons_belong_to_libraries FOREIGN KEY (library_id) REFERENCES libraries(id)


ALTER TABLE attendance_log
ADD CONSTRAINT fk_attendance_done_by_patron FOREIGN KEY (patron_id) REFERENCES patrons(patron_id)

ALTER TABLE attendance_log
ADD CONSTRAINT fk_attendance_at_library FOREIGN KEY (library_id) REFERENCES libraries(id)

ALTER TABLE librarian_logins
ADD COLUMN librarian_id BIGINT, -- Change the data type according to your requirements
ADD CONSTRAINT fk_librarian_id FOREIGN KEY (librarian_id) REFERENCES librarians(id);

ALTER TABLE attendance_log
ALTER COLUMN time_attended SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE librarian_logins
ADD PRIMARY KEY (session_id);

ALTER TABLE attendance_log
ADD PRIMARY KEY (id);

ALTER TABLE libraries
ADD PRIMARY KEY (id);



/*CREATE TABLE IF NOT EXISTS public.profiles_studentprofile
(
    id bigserial NOT NULL,
    is_active boolean NOT NULL,
    is_verified boolean NOT NULL,
    assigned_library_id bigint,
    user_id bigint NOT NULL,
    bio text COLLATE pg_catalog."default" NOT NULL,
    family_status character varying(255) COLLATE pg_catalog."default" NOT NULL,
    family_support_level integer,
    grade_level integer,
    graduation_obstacle character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_onboarded boolean NOT NULL,
    approval_status character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT profiles_studentprofile_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_careers_of_interest
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    career_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_careers_of_interest_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_career_fec904ee_uniq UNIQUE (studentprofile_id, career_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_favorite_genres
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    genre_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_favorite_genres_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_genre__4c05fe30_uniq UNIQUE (studentprofile_id, genre_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_mentoring_languages
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    language_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_mentoring_languages_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_langua_679c3eab_uniq UNIQUE (studentprofile_id, language_id)
);

CREATE TABLE IF NOT EXISTS public.profiles_studentprofile_subjects
(
    id bigserial NOT NULL,
    studentprofile_id bigint NOT NULL,
    subject_id bigint NOT NULL,
    CONSTRAINT profiles_studentprofile_subjects_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_studentprofile__studentprofile_id_subjec_cacef79b_uniq UNIQUE (studentprofile_id, subject_id)
);

CREATE TABLE IF NOT EXISTS public.subjects_genre
(
    id bigserial NOT NULL,
    "uniqueID" uuid NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT subjects_genre_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.subjects_subject
(
    id bigserial NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "uniqueID" uuid NOT NULL,
    CONSTRAINT subjects_subject_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users_user
(
    id bigserial NOT NULL,
    password character varying(128) COLLATE pg_catalog."default" NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) COLLATE pg_catalog."default",
    first_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    time_zone character varying(255) COLLATE pg_catalog."default",
    is_librarian boolean NOT NULL,
    is_mentor boolean NOT NULL,
    is_student boolean NOT NULL,
    date_of_birth date,
    is_email_verified boolean NOT NULL,
    "profileImage" character varying(512) COLLATE pg_catalog."default" NOT NULL,
    role integer,
    gender character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_user_pkey PRIMARY KEY (id),
    CONSTRAINT users_user_email_key UNIQUE (email),
    CONSTRAINT users_user_username_key UNIQUE (username)
);
);*/