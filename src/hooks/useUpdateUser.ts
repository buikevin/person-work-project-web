import { useMutation } from '@apollo/client';
import { useAppDispatch } from '../store/hooks';
import { updateUser } from '../store/slices/authSlice';
import { UPDATE_USER_MUTATION, GET_USER_QUERY, type UpdateUserInput } from '../graphql/operations/user';
import { mapUserResponseToUser } from '../utils/authMappers';

export const useUpdateUser = () => {
  const dispatch = useAppDispatch();

  const [updateUserMutation, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    // Cập nhật cache sau khi mutation thành công
    update(cache, { data }) {
      if (data?.updateUser) {
        const userId = data.updateUser._id;

        // Cập nhật cache của GET_USER_QUERY
        cache.writeQuery({
          query: GET_USER_QUERY,
          variables: { id: userId },
          data: { user: data.updateUser }
        });

        console.log('✅ Cache đã được cập nhật cho user:', userId);
      }
    }
  });

  const updateUserData = async (updateUserInput: UpdateUserInput) => {
    try {
      console.log('🔄 Đang cập nhật thông tin user:', updateUserInput);

      const { data } = await updateUserMutation({
        variables: { updateUserInput },
        // Tối ưu hóa: chỉ gửi request nếu có thay đổi
        errorPolicy: 'all'
      });

      if (data?.updateUser) {
        // Cập nhật Redux state với dữ liệu mới
        const mappedUser = mapUserResponseToUser(data.updateUser);
        dispatch(updateUser(mappedUser));

        console.log('✅ Cập nhật user thành công:', {
          id: mappedUser.id,
          fullName: mappedUser.fullName,
          email: mappedUser.email
        });

        return { success: true, data: data.updateUser };
      }

      return { success: false, error: 'Không nhận được dữ liệu từ server' };
    } catch (error) {
      console.error('❌ Lỗi cập nhật user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật'
      };
    }
  };

  return {
    updateUserData,
    loading,
    error,
    isUpdating: loading // Alias để dễ hiểu hơn
  };
};
