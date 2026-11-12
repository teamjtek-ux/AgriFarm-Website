/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageProvider } from './shared/i18n';
import { MainLayout } from './app/layout/MainLayout';
import { AppRoutes } from './app/routes/AppRoutes';

export default function App() {
  return (
    <LanguageProvider>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </LanguageProvider>
  );
}
