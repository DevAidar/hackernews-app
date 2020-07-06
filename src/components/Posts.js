import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { fetchMainPosts, fetchComments, fetchPosts, fetchUser } from '../utils/api';

import scoreImg from '../images/icons8-star.png';
import commentsImg from '../images/icons8-comments.png';

export default function Posts({ type }) {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const responce = await fetchMainPosts(type);

      setPosts(type === 'top' ? responce.sort((item1, item2) => item2.score - item1.score) : responce);
    }

    fetchData();
  }, [setPosts, type])

  useEffect(() => {
    setPosts([]);
  }, [type]);

  return posts.length > 0 ? (
    <div>
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
  ) : (<h2>Loading . . .</h2>);
}