create table user
(
    id           integer      not null primary key auto_increment,
    instagram_id bigint      not null default 0,
    name         varchar(200) not null default '',
    full_name    varchar(255) not null default '',
    access_token varchar(255) not null default '',
    ip           varchar(15)  not null default '',
    last_login_at datetime    not null default now(),
    created_at   timestamp    not null default current_timestamp,
    updated_at   timestamp    not null default current_timestamp on update current_timestamp
);

create index user_instagram_id on user(instagram_id);

create index user_last_login on user(last_login_at);

create table collector
(
    id            integer     not null primary key auto_increment,
    user_id       integer     not null,
    started_at    datetime   not null default now(),
    finished_at   datetime  default null,
    success       integer     not null default 0,
    error_details text                 default null,
    created_at   timestamp    not null default current_timestamp,
    updated_at   timestamp    not null default current_timestamp on update current_timestamp,
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
    created_at   timestamp    not null default current_timestamp,
    updated_at   timestamp    not null default current_timestamp on update current_timestamp,
    foreign key (collector_id) references collector (id) on delete restrict
);

create index stat_account_updated_at on stat_account(updated_at);

create table stat_post
(
    id         integer   not null primary key auto_increment,
    collector_id    integer   not null,
    post_id    varchar(100) not null default '',
    post_type  varchar(50) not null default 'image',
    short_code varchar(50) not null default '',
    comments integer not null default 0,
    likes integer not null default 0,
    video_views integer not null default 0,
    post_created_at datetime not null default now(),
    created_at   timestamp    not null default current_timestamp,
    updated_at   timestamp    not null default current_timestamp on update current_timestamp,
    foreign key (collector_id) references collector (id) on delete restrict
);
create index stat_post_updated_at on stat_post(updated_at);
create index stat_post_post_created_at on stat_post(post_created_at);

create table base_stats_daily (
  id integer not null primary key auto_increment,
  user_id integer not null,
  date datetime not null default now(),
  posts integer not null default 0,
  followers integer not null default 0,
  following integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  created_at   timestamp    not null default current_timestamp,
  updated_at   timestamp    not null default current_timestamp on update current_timestamp,
  foreign key (user_id) references user(id)
);
create index base_stats_date on base_stats_daily(date);

create table base_stats_weekly (
   id integer not null primary key auto_increment,
   user_id integer not null,
   date datetime not null default current_timestamp,
   posts integer not null default 0,
   followers integer not null default 0,
   following integer not null default 0,
   likes integer not null default 0,
   comments integer not null default 0,
   created_at   timestamp    not null default current_timestamp,
   updated_at   timestamp    not null default current_timestamp on update current_timestamp,
   foreign key (user_id) references user(id)
);
create index base_stats_weekly_date on base_stats_weekly(date);

