'use client';
import { FC, useEffect, useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { useModal } from "@/hooks/useModal";
import { RepositoryDetail, UserDetail } from '@/lib/types';
import { getUserByUsername } from '@/lib/data/users';
import { getRepositoriesByUserId } from '@/lib/data/repositories';
import { RepositoryCard } from './Card';
import { useUser } from '@/hooks/useUser';
import GitHubAuthButton from '@/components/GitHubAuthButton';

interface RepositoryPageProps {
  params: { username: string };
}

const Page: FC<RepositoryPageProps> = ({ params }) => {

  const { user, isLoading, isAuthenticated } = useUser();

  const [author, setAuthor] = useState<UserDetail | null>(null);
  const [authorState, setAuthorState] = useState<"loading" | "error" | "success">("loading");
  const [authorError, setAuthorError] = useState<string | null>(null);

  const [breadcrumbs, setBreadcrumbs] = useState<{ items: { label: string; href: string }[] }>({ items: [] });
  const [breadcrumbsState, setBreadcrumbsState] = useState<"loading" | "error" | "success">("loading");
  const [breadcrumbsError, setBreadcrumbsError] = useState<string | null>(null);

  const { openModal } = useModal();

  const [repositories, setRepositories] = useState<RepositoryDetail[] | null>(null);
  const [repositoryState, setRepositoryState] = useState<"loading" | "error" | "success">("loading");
  const [repositoryError, setRepositoryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { username } = await params;
      const decodedUsername = decodeURIComponent(username);
      const userResponse = await getUserByUsername(decodedUsername);
      if (!userResponse.success) {
        setAuthorState("error");
        setAuthorError(userResponse.message);
        return;
      }
      setAuthor(userResponse.data);
      setAuthorState("success");
      setAuthorError(null);
    };
    fetchUser();
  }, [params]);

  useEffect(() => {
    if (!author) {
      setRepositoryState("loading");
      setRepositoryError("Waiting for author information...");
      return;
    }
    const fetchRepositories = async () => {
      const repositoriesResponse = await getRepositoriesByUserId(author.id);
      if (!repositoriesResponse.success) {
        setRepositoryState("error");
        setRepositoryError(repositoriesResponse.message);
        return;
      }
      setRepositories(repositoriesResponse.data);
      setRepositoryState("success");
      setRepositoryError(null);
    };
    fetchRepositories();
  }, [author]);

  useEffect(() => {
    if (!author) {
      setBreadcrumbsState("loading");
      setBreadcrumbsError("Waiting for author information...");
      return;
    }
    const fetchBreadcrumbs = async () => {
      const breadcrumbs = [
        { label: author.user_name, href: `/${author.user_name}` },
        { label: "repositories", href: `/${author.user_name}/repositories` }
      ];
      setBreadcrumbs({ items: breadcrumbs });
      setBreadcrumbsState("success");
      setBreadcrumbsError(null);
    };
    fetchBreadcrumbs();
  }, [author]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (authorState === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (authorState === "error") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">
          <p>{authorError}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {breadcrumbsState === "loading" && (
        <PageHeader
          breadcrumbs={{ items: [{ label: "Loading...", href: "#" }] }}
          title="Loading..."
          rightComponent={<></>}
        />
      )}
      {breadcrumbsState === "error" && (
        <PageHeader
          breadcrumbs={{ items: [{ label: breadcrumbsError || "error loading breadcrumbs", href: "#" }] }}
          title="Error"
          rightComponent={<></>}
        />
      )}
      {breadcrumbsState === "success" && (
        <PageHeader
          breadcrumbs={breadcrumbs}
          title={`${author!.full_name}'s Repositories`}
          rightComponent={isAuthenticated ? (
            user!.id === author?.id ? (
              <Button >
                Delete Repository
              </Button>
            ) : (
              <Button >
                Add Fav Function
              </Button>
            )
          ) : (
            <GitHubAuthButton />
          )}
        />
      )}

      {repositoryState === "error" && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500">
            <p>{repositoryError}</p>
          </div>
        </div>
      )}

      {repositoryState === "loading" && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      {repositoryState === "success" && (
        <div className=" w-full bg-background-light dark:bg-background-dark   p-6   space-y-6">
          {repositories?.map((repository) => (
            <RepositoryCard
              key={repository.id}
              repository={repository}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Page;