import {newModel, MemoryAdapter} from "casbin.js";

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new MemoryAdapter(`
p, admin, home, (list)|(create)
p, admin, home, (show)|(edit)|(delete)

p, admin, all_institutions, (list)|(create)
p, admin, all_institutions, (show)|(edit)|(delete)
p, admin, all_institutions, update_status

p, admin, chats, (list)|(create)
p, admin, chats, (show)|(edit)|(delete)
p, admin, chats, searchChatsByPlace

p, admin, cities, cityWithData

p, admin, news, (list)|(create)
p, admin, news, (show)|(edit)|(delete)

p, user, home, (show)
p, user, news, (show)

p, admin, institutions, adminListInstitutions
p, admin, institutions, userListInstitutions
p, admin, news, adminListNews

p, admin, capl, (list)|(create)
p, admin, capl, managerListReserve
p, admin, capl, (show)|(edit)|(delete)
p, admin, capl, updateUserStatus
p, admin, capl, updateInstitutionStatus

p, admin, institution/deleteOne, delete

p, admin, my-review, list

p, admin, all-reviews, (list)|(create)
p, admin, all-reviews, (edit)|(show)|(delete)

p, admin, favorite-places, list

p, admin, all-places, (list)|(create)
p, admin, all-places, (edit)|(show)|(delete)

p, admin, all-users, (list)|(create)
p, admin, all-users, (edit)|(show)|(delete)

p, admin, all-news, (list)|(create)
p, admin, all-news, (edit)|(show)|(delete)

p, admin, top_institutions, (list)|(create)
p, admin, top_institutions, show

p, admin, profile, (list)|(create)
p, admin, profile, (edit)|(show)|(delete) 

p, admin, all-places, (list)|(create)
p, admin, all-places, (show)|(edit)|(delete)

p, admin, menu, (create)
p, admin, menu, (show)|(edit)|(delete)

p, manager, menu, (show)|(edit)|(delete)
p, manager, menu, create

p, manager, chats, (list)|(create)
p, manager, chats, searchChatsByPlace

p, user, menu, show

p, manager, home, (list)|(create)
p, manager, news, (list)|(create)
p, manager, news, (edit)|(delete)|(show)
p, manager, all_institutions, (list)|(create)
p, manager, all_institutions, (show)|(edit)|(delete)

p, manager, top_institutions, (list)|(create)
p, manager, top_institutions, show

p, manager, profile, list
p, manager, profile, edit

p, manager, institutions, userListInstitutions
p, manager, news, userListNews

p, manager, capl, managerListReserve
p, manager, capl, updateInstitutionStatus
p, manager, capl, (list)|(create)
p, manager, capl, (show)|(edit)

p, manager, my-reviews, list
p, manager, favorite-places, list
p, manager, favorite-places, delete


p, user, home, (list)
p, user, news, (list)
p, user, all_institutions, (list)
p, user, all_institutions, (show)

p, user, top_institutions, (list)
p, user, top_institutions, show

p, user, profile, list
p, user, profile, edit

p, user, chats, (list)|(create)

p, user, capl, (list)|(create)
p, user, capl, (show)|(edit)
p, user, capl, userListReserve
p, user, capl, updateUserStatus

p, user, institutions, userListInstitutions
p, user, news, userListNews

p, user, my-reviews, list
p, user, favorite-places, list
p, user, favorite-places, delete

`);