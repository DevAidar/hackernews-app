import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { fetchItem, fetchComments, fetchUser } from '../utils/api';

import scoreImg from '../images/icons8-star.png';
import commentsImg from '../images/icons8-comments.png';

import './Post.css';

export default function Post() {
  const params = useParams();

  const [post, setPost] = useState({});
  const [limit, setLimit] = useState(2);
  const [comments, setComments] = useState([]);
  const [position, setPosition] = useState(null);

  const getComments = position => {
    let result = comments;
    for (let i = 0; i < position.length - 1; i++)
      result = result[position[i]].comments;

    return result[position[position.length - 1]];
  }

  const addComments = (newComments, position) => {
    const getComment = (comments, position) => {
      if (position.length > 1)
        comments = [
          ...comments.slice(0, position[0]),
          { ...comments[position[0]], comments: getComment(comments[position[0]].comments, position.slice(1)) },
          ...comments.slice(position[0] + 1),
        ];
      else
        return [
          ...comments.slice(0, position[0]),
          { ...comments[position[0]], comments: newComments },
          ...comments.slice(position[0] + 1),
        ];
      return comments;
    }

    setComments(getComment(comments, position));
    setPosition(null);
  }

  const getCleanComment = (comment) => comment.split('<').map((s, index) => index > 0 ? s.substr(s.indexOf('>') + 1) : s).join('').split('&#x27;').join("'").split('&quot;').join('"').split('&#x2F;').join('/').split('&gt;').join('    ').split('&lt;').join('    ').split('&amp;').join('&');

  const renderComments = () => {
    const render = (commentsX, position) => commentsX ? commentsX.slice(0, position.length > 0 ? comments.length : limit).map((comment, index) => (
      <div key={`${comment.id}.${comment.by}.${index}`} className='media'>
        <div className="media-body">
          <Link to={`/hacker-news-app/user/${comment.by}/`}><h5 className='mt-0 font-weight-bold blue-text'>{comment.by}</h5></Link>
          <h5>{getCleanComment(comment.text)}</h5>
          {comment.comments && comment.comments.length > 0
            ? <div className='media-right'>
              {render(comment.comments, [...position, index])}
            </div>
            : comment.kids && comment.kids.length > 0
              ? <>
                <button type='button' className='btn btn-link' onClick={() => setPosition([...position, index])}>Continue . . .</button>
              </>
              : <></>
          }
        </div>
      </div>
    )) : <></>;

    return render(comments, []);
  }

  useEffect(() => {
    if (params.id) {
      const fetchData = async () => {
        const responce = await fetchItem(params.id);

        setPost(responce);
      }

      fetchData();
    }
  }, [setPost]);

  useEffect(() => {
    if (post && position) {
      const fetchData = async () => {
        const response = await fetchComments(getComments(position).kids);

        addComments(response.map(comment => comment = { text: comment.text, by: comment.by, comments: [], kids: comment.kids }), position);
      }

      fetchData();
    }
  }, [position]);

  useEffect(() => {
    if (post.kids) {
      const fetchData = async () => {
        const response = await fetchComments(post.kids);

        setComments(response.map(comment => comment = { text: comment.text, by: comment.by, comments: [], kids: comment.kids }));
      }

      fetchData();
    }
  }, [post]);

  return post ? (
    <div>
      <div key={post.id} className="blog-post no-bottom-margin">
        <a href={post.url ? post.url : ''} className='component'>
          <h2 className="blog-post-title">{post.title}</h2>
        </a>
        <p className="blog-post-meta">
          {`By `}
          <Link to={`/hacker-news-app/user/${post.by}/`} className='component'>
            {post.by}
          </Link>
        </p>
        <p><a href={post.url}>Continue reading...</a></p>
        <div>
          <img src={scoreImg} alt='score' className='logo' />
          {post.score}
        </div>
      </div>
      {post.kids
        ? <div className='post-commnets'>
          <div className='row'>
            {post.kids ? renderComments() : <></>}
            {post.kids.length > 0 && limit < post.kids.length
              ? <button type='button' className='btn btn-success btn-block btn-space' onClick={() => setLimit(Math.min(post.kids.length, limit + 10))}>More Comments</button>
              : <></>
            }
          </div>
        </div>

        : <></>
      }
    </div>
  ) : (<h2>Loading . . .</h2>);
}