import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import {
  GET_PROJECTS_QUERY,
  GET_PROJECT_QUERY,
  READ_FILE_QUERY,
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
  REMOVE_PROJECT_MUTATION,
  type Project,
  type CreateProjectInput,
  type UpdateProjectInput,
  type FileContent,
  type ReadFileInput
} from '../graphql/operations/project';

/**
 * Hook để fetch tất cả projects
 */
export const useProjects = () => {
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS_QUERY, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    onError: (error) => {
      // Chỉ hiển thị toast nếu không phải lỗi field không tồn tại
      if (!error.message.includes('Cannot query field "projects"')) {
        toast.error('Không thể tải danh sách dự án', {
          description: error.message
        });
      }
    }
  });

  return {
    projects: data?.projects || [],
    loading,
    error,
    refetchProjects: refetch,
    hasProjects: (data?.projects || []).length > 0
  };
};

/**
 * Hook để fetch project by ID
 */
export const useProject = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_PROJECT_QUERY, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    onError: (error) => {
      toast.error('Không thể tải thông tin dự án', {
        description: error.message
      });
    }
  });

  return {
    project: data?.project,
    loading,
    error,
    refetchProject: refetch
  };
};

/**
 * Hook để tạo project mới
 */
export const useCreateProject = () => {
  const [createProjectMutation, { loading, error }] = useMutation(CREATE_PROJECT_MUTATION, {
    // Cập nhật cache sau khi tạo project thành công
    update(cache, { data }) {
      if (data?.createProject) {
        // Cập nhật cache của GET_PROJECTS_QUERY
        try {
          const existingProjects = cache.readQuery<{ projects: Project[] }>({
            query: GET_PROJECTS_QUERY
          });

          if (existingProjects) {
            cache.writeQuery({
              query: GET_PROJECTS_QUERY,
              data: {
                projects: [data.createProject, ...existingProjects.projects]
              }
            });
          }

        } catch (error) {
          console.warn('Cache update failed:', error);
        }
      }
    }
  });

  const createProject = async (createProjectInput: CreateProjectInput) => {
    try {
      const { data } = await createProjectMutation({
        variables: { createProjectInput },
        errorPolicy: 'all'
      });

      if (data?.createProject) {
        toast.success('Tạo dự án thành công!', {
          description: `Dự án "${data.createProject.name}" đã được tạo.`
        });
        return { success: true, data: data.createProject };
      }

      return { success: false, error: 'Không nhận được dữ liệu từ server' };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi tạo dự án';
      
      toast.error('Tạo dự án thất bại', {
        description: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  return {
    createProject,
    loading,
    error,
    isCreating: loading
  };
};

/**
 * Hook để cập nhật project
 */
export const useUpdateProject = () => {
  const [updateProjectMutation, { loading, error }] = useMutation(UPDATE_PROJECT_MUTATION, {
    update(cache, { data }) {
      if (data?.updateProject) {
        const projectId = data.updateProject._id;
        
        // Cập nhật cache của GET_PROJECT_QUERY
        cache.writeQuery({
          query: GET_PROJECT_QUERY,
          variables: { id: projectId },
          data: { project: data.updateProject }
        });

      }
    }
  });

  const updateProject = async (updateProjectInput: UpdateProjectInput) => {
    try {

      const { data } = await updateProjectMutation({
        variables: { updateProjectInput },
        errorPolicy: 'all'
      });

      if (data?.updateProject) {
        toast.success('Cập nhật dự án thành công!', {
          description: `Dự án "${data.updateProject.name}" đã được cập nhật.`
        });
        return { success: true, data: data.updateProject };
      }

      return { success: false, error: 'Không nhận được dữ liệu từ server' };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi cập nhật dự án';
      
      toast.error('Cập nhật dự án thất bại', {
        description: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  return {
    updateProject,
    loading,
    error,
    isUpdating: loading
  };
};

/**
 * Hook để đọc file content
 */
export const useReadFile = (slug: string, path: string, skip: boolean = false) => {
  const { data, loading, error, refetch } = useQuery(READ_FILE_QUERY, {
    variables: { input: { slug, path } },
    skip: skip || !slug || !path,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    onError: (error) => {
      toast.error('Không thể tải nội dung file', {
        description: error.message
      });
    }
  });

  return {
    fileContent: data?.readFile,
    loading,
    error,
    refetchFile: refetch
  };
};

/**
 * Hook để lazy load file content
 */
export const useReadFileLazy = () => {
  const [readFileQuery, { data, loading, error }] = useLazyQuery(READ_FILE_QUERY, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    onError: (error) => {
      toast.error('Không thể tải nội dung file', {
        description: error.message
      });
    }
  });

  const readFile = async (slug: string, path: string): Promise<FileContent | null> => {
    try {
      const result = await readFileQuery({ variables: { input: { slug, path } } });
      return result.data?.readFile || null;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  };

  return {
    readFile,
    fileContent: data?.readFile,
    loading,
    error
  };
};

/**
 * Hook để xóa project
 */
export const useRemoveProject = () => {
  const [removeProjectMutation, { loading, error }] = useMutation(REMOVE_PROJECT_MUTATION, {
    update(cache, { data }) {
      if (data?.removeProject) {
        const projectId = data.removeProject._id;

        // Xóa project khỏi cache của GET_PROJECTS_QUERY
        try {
          const existingProjects = cache.readQuery<{ projects: Project[] }>({
            query: GET_PROJECTS_QUERY
          });

          if (existingProjects) {
            cache.writeQuery({
              query: GET_PROJECTS_QUERY,
              data: {
                projects: existingProjects.projects.filter(p => p._id !== projectId)
              }
            });
          }

        } catch (error) {
          console.warn('Cache update failed:', error);
        }
      }
    }
  });

  const removeProject = async (id: string) => {
    try {

      const { data } = await removeProjectMutation({
        variables: { id },
        errorPolicy: 'all'
      });

      if (data?.removeProject) {
        toast.success('Xóa dự án thành công!', {
          description: `Dự án "${data.removeProject.name}" đã được xóa.`
        });
        return { success: true, data: data.removeProject };
      }

      return { success: false, error: 'Không nhận được dữ liệu từ server' };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi xóa dự án';
      
      toast.error('Xóa dự án thất bại', {
        description: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  return {
    removeProject,
    loading,
    error,
    isRemoving: loading
  };
};
