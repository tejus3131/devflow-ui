'use client';
import { FC, useEffect, useState } from 'react';
import PageHeader from "@/components/PageHeader";
import ContentCardList from "@/components/ContentCardList";
import { ContentCardProps } from "@/components/ContentCard";
import { Button } from "@/components/Button";
import { useModal } from "@/hooks/useModal";
import { ContentType, RepositoryDetail, Vote } from '@/lib/types';
import { RepositoryForm } from './add_form';

interface RepositoryPageProps {
  params: { username: string };
}

const Page: FC<RepositoryPageProps> = ({ params }) => {

  const [username, setUsername] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ items: { label: string; href: string }[] }>({ items: [] });
  const { openModal } = useModal();
  const [repositories, setRepositories] = useState<RepositoryDetail[] | null>(null);
  const [cardData, setCardData] = useState<ContentCardProps[]>([]);
  const [usedNames, setUsedNames] = useState<string[]>([]);

  const addRepository = (repository: RepositoryDetail) => {
    if (repositories) {
      setRepositories([...repositories, repository]);
    }
  }

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {

      const { username } = await params;
      setUsername(username);

      fetch(`/api/repositories?username=${username}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const repo = data.data;
            setRepositories(repo);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    };

    fetchUserData();
  }, [params]);
  useEffect(() => {
    if (username) {
      setBreadcrumbs({
        items: [
          { label: username, href: `/${username}/profile` },
          { label: 'repositories', href: `/${username}/repositories` },
        ],
      });
    }
  }, [username]);

  useEffect(() => {
    if (repositories) {
      const processData = async () => {
        const promises = repositories.map(formatCardData);
        const formattedData = await Promise.all(promises);
        setCardData(formattedData);
        const names = formattedData.map((item) => item.name);
        setUsedNames(names);
      };
      processData();
    }
  }, [repositories]);

  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }


  const formatCardData = async (repository: RepositoryDetail) => {
    const votesRes = await fetch(`/api/repositories/${repository.id}/votes`);
    const votesData = await votesRes.json();
    const votes: Vote[] = votesData.data;
    const userVote = votes.find((vote: Vote) => vote.user_id === repository.author_id);

    const upvotes = votes.filter((vote: Vote) => vote.vote === "upvote").length;
    const downvotes = votes.filter((vote: Vote) => vote.vote === "downvote").length;

    const userRes = await fetch(`/api/users?user_id=${repository.author_id}`);
    const userData = await userRes.json();
    const user = userData.data;

    // Create a new array with all the existing breadcrumb items plus the new one
    const locationItems = [
      ...breadcrumbs.items,
      { label: repository.name, href: `/${username}/${repository.name}` }
    ];

    return {
      id: repository.id,
      name: repository.name,
      description: repository.description,
      location: {
        items: locationItems,
      },
      type: "Repository" as ContentType,
      author: {
        user_name: user.user_name,
        avatar_url: user.avatar_url,
      },
      tags: repository.tags,
      upvotes: upvotes,
      downvotes: downvotes,
      userVote: userVote ? userVote.vote : null,
    };
  }


  if (repositories === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading repositories...</p>
      </div>
    );
  }

  return (
    <>
      <RepositoryForm
        initialValues={{ name: '', description: '', tags: [] }}
        onSuccess={addRepository}
        usedNames={usedNames}
      />
      <PageHeader
        breadcrumbs={breadcrumbs}
        title="Repositories"
        rightComponent={
          <Button
            variant="primary"
            className="px-5 py-3"
            onClick={() => openModal("repository_form")}
          >
            Create New Repository
          </Button>
        }
      />

      <ContentCardList items={cardData} />
    </>
  );
};

export default Page;
