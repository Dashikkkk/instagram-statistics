create table user
(
  id           integer      not null primary key auto_increment,
  instagram_id integer      not null default 0,
  name         varchar(200) not null default '',
  full_name    varchar(255) not null default '',
  access_token varchar(255) not null default '',
  ip           varchar(15)  not null default '',
  last_login   timestamp    not null default current_timestamp,
  created_at   timestamp    not null default current_timestamp,
  updated_at   timestamp    not null default current_timestamp
);

create index user_instagram_id on user(instagram_id);

create index user_last_login on user(last_login);

create table collector
(
  id            integer     not null primary key auto_increment,
  user_id       integer     not null,
  started_at    timestamp   not null default current_timestamp,
  finished_at   timestamp   not null default current_timestamp,
  success       integer     not null default 0,
  error_details text                 default null,
  foreign key (user_id) references user (id) on delete restrict
);

create index collector_finished_at on collector(finished_at);

create table stat_account
(
  id              integer   not null primary key auto_increment,
  collector_id    integer   not null,
  posts           integer   not null default 0,
  followers       integer   not null default 0,
  following       integer   not null default 0,
  created_at      timestamp not null default current_timestamp,
  updated_at      timestamp not null default current_timestamp,
  foreign key (collector_id) references collector (id) on delete restrict
);

create index stat_account_updated_at on stat_account(updated_at);
