package com.beepmemobile.www.ui.home

import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.R
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.AuthState
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.HomeFragmentBinding
import com.beepmemobile.www.ui.binding.UserSmallCardListAdapter
import com.beepmemobile.www.ui.main.MainViewModel

class HomeFragment : Fragment(){
    private var popupItemData: Any? = null
    private val model: HomeListViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()

    private var userCardListAdapter: UserSmallCardListAdapter? =null

    private val navController by lazy { findNavController() }

    private var _binding: HomeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = HomeFragment()
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setHasOptionsMenu(true)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = HomeFragmentBinding.inflate(inflater, container, false)
            val view = binding.root

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        authNavigation(view)
        super.onViewCreated(view, savedInstanceState)
    }

    private fun authNavigation(view: View){

        val observer = Observer<AppUser> { app_user ->


                if (app_user.authenticated) {

                    viewConten(view)

                } else if (app_user.auth_state == AuthState.AUTH_STAGE_NONE) {

                    view.visibility = View.GONE//come back

                    var direction = HomeFragmentDirections.moveToNavGraphSignup()
                    navController.navigate(direction)
                }

            
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)

    }

    private fun viewConten(view: View){

        binding.root.post {

            // bind RecyclerView

            var column_count = 2
            var preferred_column_width = binding.root.context.resources.getDimensionPixelSize(R.dimen.user_small_card_width)

            if(binding.root.width != 0){
                column_count = binding.root.width / preferred_column_width
            }

            binding.homePeopleNearbyHeader.listSubheaderTitle.text  = "People You May Know Nearby"

            var recyclerView: RecyclerView = binding.homePeopleNearbyRecyclerView
            recyclerView.layoutManager = GridLayoutManager(this.context, column_count)
            userCardListAdapter = UserSmallCardListAdapter(this, "", false)
            recyclerView.adapter = userCardListAdapter

            createObserversAndGetData()

        }
    }

    private fun createObserversAndGetData(){
        var app_user = authModel.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<User>> { users ->
            if (app_user != null) {
                userCardListAdapter?.setUserCardList(app_user, users)
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
