import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { fetchPosts, fetchComments, fetchUser } from '../utils/api';

import scoreImg from '../images/icons8-star.png';
import commentsImg from '../images/icons8-comments.png';

export default function User() {
  const params = useParams();

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (params.username) {
      const fetchData = async () => {
        const response = await fetchUser(params.username);

        setUser(response);
      }

      fetchData();
    }
  }, [setUser]);

  useEffect(() => {
    if (user.submitted) {
      const fetchData = async () => {
        const response = await fetchPosts(user.submitted);

        setPosts(response);
      }

      fetchData();
    }
  }, [user])

  return (
    <div>
      <h1>{`Posts by ${params.username}`}</h1>
      {Object.entries(user).length !== 0
        ? <>
          <p className="blog-post-meta">
            {`Karma: ${user.karma}`}
          </p>
          <br />
          {posts.length > 0
            ? <div>
              {posts.slice(0, limit).map(post => (
                <div key={post.id} className="blog-post">
                  <Link to={`/hackernews-app/post/${post.id}/`} className='component'>
                    <h2 className="blog-post-title no-wrap">{post.title}</h2>
                  </Link>
                  <p className="blog-post-meta">
                    {`By `}
                    <Link to={`/hackernews-app/user/${post.by}/`} className='component'>
                      {post.by}
                    </Link>
                  </p>
                  <Link to={`/hackernews-app/post/${post.id}/`} className='components'>
                    <div className='components'>
                      <img src={scoreImg} alt='score' className='logo' />
                      <p className='component'>{post.score}</p>
                    </div>
                    <span className='components'>
                      <img src={commentsImg} alt='comments' className='logo' />
                      <p className='component'>{post.kids ? post.kids.length : 0}</p>
                    </span>
                  </Link>
                </div>
              ))}
              {limit < posts.length
                ? <button type='button' className='btn btn-primary btn-block' onClick={() => setLimit(Math.min(posts.length, limit + 10))}>More Posts</button>
                : <></>
              }
            </div>
            : <h2>Loading . . .</h2>
          }
        </>
        : null
      }
    </div>
  );
}