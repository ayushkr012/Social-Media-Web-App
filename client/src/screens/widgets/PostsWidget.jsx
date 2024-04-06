import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

// props data came from homePage/index.jsx and profilePage/index.jsx
const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const BackendUrl = useSelector((state) => state.BackendUrl);

  // get all the user post ( to show in the feed )
  const getPosts = async () => {
    const response = await fetch(`${BackendUrl}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
    dispatch(setPosts({ posts: data }));
  };

  // get all the post of particular user
  const getUserPosts = async () => {
    const response = await fetch(`${BackendUrl}/posts/${userId}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {Array.isArray(posts) &&
        posts.map(
          ({
            _id, // id of the post
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id} // using _id is we can delete the particular post
              postUserId={userId} // using userId we delete all the post of the current user
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              isProfile={isProfile}
            />
          )
        )}
    </>
  );
};

export default PostsWidget;
