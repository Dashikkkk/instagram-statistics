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
    post_created_at timestamp not null default current_timestamp,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    foreign key (collector_id) references collector (id) on delete restrict
);
create index stat_post_updated_at on stat_post(updated_at);
create index stat_post_post_created_at on stat_post(post_created_at);
