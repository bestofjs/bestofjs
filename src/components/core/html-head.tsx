import { useTitle } from 'react-use'

export function usePageTitle(title: string) {
  return useTitle(title + ' | Best of JS')
}
