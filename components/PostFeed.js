import Link from 'next/link';

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {

    return (
        <>
            <Link href={`/admin/${post.slug}`}>
                <div className="card">
                    <footer>
                        <h2>{post.title}</h2>
                    </footer>
                </div>
            </Link>
        </>
    );
}