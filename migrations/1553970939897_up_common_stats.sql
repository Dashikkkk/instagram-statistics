create table base_stats_daily (
    id integer not null primary key autoincrement,
    user_id integer not null,
    date date not null default current_timestamp,
    posts integer not null default 0,
    followers integer not null default 0,
    following integer not null default 0,
    likes integer not null default 0,
    comments integer not null default 0,
    foreign key (user_id) references user(id)
);
create index base_stats_date on base_stats_daily(date);

create table base_stats_weekly (
  id integer not null primary key autoincrement,
  user_id integer not null,
  date date not null default current_timestamp,
  posts integer not null default 0,
  followers integer not null default 0,
  following integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  foreign key (user_id) references user(id)
);
create index base_stats_weekly_date on base_stats_weekly(date);

